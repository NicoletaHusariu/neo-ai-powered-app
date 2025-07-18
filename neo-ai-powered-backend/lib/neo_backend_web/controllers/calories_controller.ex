defmodule NeoBackendWeb.CaloriesController do
  use NeoBackendWeb, :controller
  alias NeoBackend.OpenAI.Client

  def analyze(conn, %{"meal" => meal}) do
    prompt = "Estimate calories for the following meal and break it down by item: #{meal}"

    with {:ok, _response} <- Client.chat(prompt) do
      json(conn, %{
        totalCalories: 650,
        breakdown: [
          %{food: "Example Food", calories: 250, details: "Example detail"},
          %{food: "Another Food", calories: 400, details: "Another detail"}
        ]
      })
    else
      _ -> send_resp(conn, 500, "Calorie analysis failed")
    end
  end
end