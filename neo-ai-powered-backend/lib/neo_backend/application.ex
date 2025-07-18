defmodule NeoBackend.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Starts endpoint Phoenix
      NeoBackendWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: NeoBackend.Supervisor]
    Supervisor.start_link(children, opts)
  end
end