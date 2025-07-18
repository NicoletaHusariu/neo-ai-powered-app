defmodule NeoBackendWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :neo_backend

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Jason

  plug Plug.MethodOverride
  plug Plug.Head
  plug CORSPlug,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    headers: ["Authorization", "Content-Type"]
  plug NeoBackendWeb.Router
end