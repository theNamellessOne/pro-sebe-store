use neon::prelude::*;
use once_cell::sync::OnceCell;
use sqlx::mysql::MySqlPoolOptions;
use tokio::runtime::Runtime;

use crate::recommender::Product;

mod recommender;

fn runtime<'a, C: Context<'a>>(cx: &mut C) -> NeonResult<&'static Runtime> {
    static RUNTIME: OnceCell<Runtime> = OnceCell::new();

    RUNTIME.get_or_try_init(|| Runtime::new().or_else(|err| cx.throw_error(err.to_string())))
}

async fn fetch_and_recommend(db_url: &str, target_article: String) -> Vec<String> {
    let pool = match MySqlPoolOptions::new()
        .max_connections(10)
        .connect(db_url)
        .await
    {
        Ok(pool) => {
            println!("✅ Connection to the database is successful!");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    let products = sqlx::query_as!(Product, "SELECT article, name, description FROM Product")
        .fetch_all(&pool)
        .await
        .unwrap();

    recommender::recommend(products, target_article)
}

fn recommend_to_js(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let rt = runtime(&mut cx)?;
    let channel = cx.channel();
    let (deferred, promise) = cx.promise();
    let db_url = cx
        .argument::<JsString>(0)
        .expect("no db url supplied")
        .value(&mut cx);
    let target_article = cx
        .argument::<JsString>(1)
        .expect("no target article supplied")
        .value(&mut cx);

    rt.spawn(async move {
        let article_vec = fetch_and_recommend(&db_url, target_article).await;
        let article_string = article_vec.join(" ");

        deferred.settle_with(&channel, move |mut cx| Ok(cx.string(article_string)));
    });

    Ok(promise)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("recommend", recommend_to_js)?;
    Ok(())
}
