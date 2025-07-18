defmodule NeoBackend.OpenAI.Client do
  @moduledoc "Handles OpenAI API integration for translation, calories, and summary"
  @openai_url "https://api.openai.com/v1/chat/completions"

  require Logger

  def chat(prompt) do
    api_key = Application.get_env(:neo_backend, :openai_api_key)

    if is_nil(api_key) do
      Logger.error("Missing OpenAI API key. Make sure OPENAI_API_KEY is set.")
      {:error, "Missing API key"}
    else
      headers = [
        {"Content-Type", "application/json"},
        {"Authorization", "Bearer #{api_key}"}
      ]

      body = %{
        model: "gpt-4",
        messages: [%{role: "user", content: prompt}]
      }

      case HTTPoison.post(@openai_url, Jason.encode!(body), headers) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          {:ok, body |> Jason.decode!() |> get_in(["choices", Access.at(0), "message", "content"])}

        {:ok, %HTTPoison.Response{status_code: code, body: body}} ->
          Logger.error("OpenAI error #{code}: #{body}")
          {:error, "OpenAI API error: #{code}"}

        {:error, reason} ->
          Logger.error("HTTP error: #{inspect(reason)}")
          {:error, "Request failed"}
      end
    end
  end
end