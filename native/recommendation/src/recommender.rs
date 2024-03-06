use std::collections::HashMap;

use rayon::{
    iter::{IntoParallelRefIterator, ParallelIterator},
    slice::ParallelSliceMut,
};

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
) -> Vec<ProductWithSimilarity> {
    let mut similarities = products
        .par_iter()
        .map(|product| {
            let similarity = match target.article == product.article {
                true => 10.0,
                false => cosine_similarity(&target.tfidf, &product.tfidf),
            };

            ProductWithSimilarity {
                article: product.article.clone(),
                similarity,
            }
        })
        .collect::<Vec<_>>();

    similarities.par_sort_by(|a, b| a.similarity.total_cmp(&b.similarity).reverse());
    similarities.remove(0);
    similarities.truncate(8);

    similarities
}

pub fn recommend(products: Vec<Product>, target_article: String) -> Vec<String> {
    let products_with_tokens = products
        .par_iter()
        .map(|product| ProductWithTokens {
            article: product.article.clone(),
            tokens: tfidf_summarizer::tokenize(&format!(
                "{} {}",
                &product.name, &product.description
            )),
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

    find_most_similar(target, &products_with_tfidf)
        .iter()
        .map(|product| product.article.clone())
        .collect::<Vec<_>>()
}
