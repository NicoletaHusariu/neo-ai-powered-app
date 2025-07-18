defmodule NeoBackendWeb do
  def controller do
    quote do
      use Phoenix.Controller, namespace: NeoBackendWeb
      import Plug.Conn
      alias NeoBackendWeb.Router.Helpers, as: Routes
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end