use std::collections::HashMap;

use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

#[derive(Debug)]
pub struct Product {
    pub article: String,
    pub name: String,
    pub description: String,
}

#[derive(Debug)]
pub struct ProductWithTokens {
    pub article: String,
    pub tokens: Vec<String>,
}

#[derive(Debug)]
pub struct ProductWithTfIdf {
    pub article: String,
    pub tfidf: HashMap<String, f64>,
}

#[derive(Debug)]
pub struct ProductWithSimilarity {
    pub article: String,
    pub similarity: f64,
}

fn cosine_similarity(doc1: &HashMap<String, f64>, doc2: &HashMap<String, f64>) -> f64 {
    let mut dot_product = 0.0;
    let mut magnitude1 = 0.0;
    let mut magnitude2 = 0.0;

    for (word, value1) in doc1.iter() {
        let value2 = doc2.get(word).unwrap_or(&0.0);
        dot_product += value1 * value2;
        magnitude1 += value1 * value1;
        magnitude2 += value2 * value2;
    }

    (dot_product / (magnitude1.sqrt() * magnitude2.sqrt())).abs()
}

fn find_most_similar(
    target: &ProductWithTfIdf,
    products: &[ProductWithTfIdf],
    threshold: f64,
) -> Vec<ProductWithSimilarity> {
    let mut similarities = Vec::new();
    for product in products.iter() {
        if target.article == product.article {
            similarities.push(ProductWithSimilarity {
                article: product.article.clone(),
                similarity: 10.0,
            });
            continue;
        }

        let similarity = cosine_similarity(&target.tfidf, &product.tfidf);
        if similarity >= threshold {
            similarities.push(ProductWithSimilarity {
                article: product.article.clone(),
                similarity,
            });
        }
    }

    similarities.sort_by(|a, b| a.similarity.total_cmp(&b.similarity).reverse());
    similarities.remove(0);
    similarities.truncate(10);

    similarities
}

pub fn recommend(products: Vec<Product>, target_article: String) -> Vec<String> {
    let products_with_tokens = products
        .par_iter()
        .map(|product| {
            let str = &format!("{} {}", &product.name, &product.description);
            ProductWithTokens {
                article: product.article.clone(),
                tokens: tfidf_summarizer::tokenize(str),
            }
        })
        .collect::<Vec<_>>();

    let df = tfidf_summarizer::document_frequency(
        &products_with_tokens
            .par_iter()
            .map(|product| product.tokens.clone())
            .collect::<Vec<_>>(),
    );
    let idf = tfidf_summarizer::inverse_document_frequency(&df, products.len());

    let products_with_tfidf = products_with_tokens
        .par_iter()
        .map(|product| ProductWithTfIdf {
            article: product.article.clone(),
            tfidf: tfidf_summarizer::tf_idf(product.tokens.clone(), &idf),
        })
        .collect::<Vec<_>>();

    let target = products_with_tfidf
        .par_iter()
        .find_any(|&product| product.article == target_article)
        .unwrap();

    find_most_similar(target, &products_with_tfidf, 0.0)
        .iter()
        .map(|product| product.article.clone())
        .collect::<Vec<_>>()
}
