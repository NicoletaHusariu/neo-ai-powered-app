defmodule NeoBackendWeb.Router do
  use NeoBackendWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", NeoBackendWeb do
    pipe_through :api

    post "/translate", TranslateController, :translate
    post "/calories", CaloriesController, :analyze
    post "/summarize", SummarizeController, :summarize
  end
end