import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { setupStore } from "../../shared/store/store";

const store = setupStore();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <HashRouter>{children}</HashRouter>
    </Provider>
  );
};
