import Config

config :neo_backend, :openai_api_key, System.fetch_env!("OPENAI_API_KEY")