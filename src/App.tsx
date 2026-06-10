import "./App.css";
import MainWindow from "./views/main-window";
import MagnetWindow from "./views/magnet-window";
import TorrentWindow from "./views/torrent-window";

function App() {
  const params = new URLSearchParams(window.location.search);
  const windowType = params.get("window");

  const windows = {
    magnet: MagnetWindow,
    torrent: TorrentWindow,
  };

  const Component = windows[windowType as keyof typeof windows] || MainWindow;
  return <Component />;
}

export default App;
