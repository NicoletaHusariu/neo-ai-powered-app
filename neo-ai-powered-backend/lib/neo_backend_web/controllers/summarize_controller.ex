defmodule NeoBackendWeb.SummarizeController do
  use NeoBackendWeb, :controller
  alias NeoBackend.OpenAI.Client

  def summarize(conn, %{"text" => text}) do
    prompt = "Summarize the following document and extract key points: #{text}"

    with {:ok, summary} <- Client.chat(prompt) do
      json(conn, %{
        summary: summary,
        keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
        wordCount: String.split(text) |> length()
      })
    else
      _ -> send_resp(conn, 500, "Summarization failed")
    end
  end
end