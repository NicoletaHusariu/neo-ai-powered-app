defmodule NeoBackendWeb.TranslateController do
  use NeoBackendWeb, :controller
  alias NeoBackend.OpenAI.Client

  def translate(conn, %{"text" => text, "sourceLang" => source, "targetLang" => target}) do
    prompt = "Translate this text from #{source} to #{target}: #{text}"

    with {:ok, translation} <- Client.chat(prompt) do
      json(conn, %{
        originalText: text,
        translatedText: translation,
        sourceLang: source,
        targetLang: target
      })
    else
      _ -> send_resp(conn, 500, "Translation failed")
    end
  end
end