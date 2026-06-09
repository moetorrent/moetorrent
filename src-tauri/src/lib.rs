use sysinfo::Disks;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder, Window};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn open_magnet_window(app: AppHandle) -> Result<(), String> {
    if let Some(win) = app.get_webview_window("magnet") {
        win.show().map_err(|e| e.to_string())?;
        win.set_focus().map_err(|e| e.to_string())?;
    } else {
        let mut builder =
            WebviewWindowBuilder::new(&app, "magnet", WebviewUrl::App("?window=magnet".into()))
                .title("Add magnet link")
                .inner_size(400.0, 200.0)
                .resizable(false)
                .visible(false);

        if let Some(main_win) = app.get_webview_window("main") {
            if let (Ok(pos), Ok(size), Ok(scale_factor)) = (
                main_win.outer_position(),
                main_win.outer_size(),
                main_win.scale_factor(),
            ) {
                let child_w_phys = (400.0 * scale_factor) as i32;
                let child_h_phys = (200.0 * scale_factor) as i32;
                let x_phys = pos.x + (size.width as i32 - child_w_phys) / 2;
                let y_phys = pos.y + (size.height as i32 - child_h_phys) / 2;
                let x_log = x_phys as f64 / scale_factor;
                let y_log = y_phys as f64 / scale_factor;
                builder = builder.position(x_log, y_log);
            }
        }

        builder.build().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn open_torrent_window(app: AppHandle) -> Result<(), String> {
    if let Some(win) = app.get_webview_window("torrent") {
        win.show().map_err(|e| e.to_string())?;
        win.set_focus().map_err(|e| e.to_string())?;
    } else {
        let mut builder =
            WebviewWindowBuilder::new(&app, "torrent", WebviewUrl::App("?window=torrent".into()))
                .title("Add torrent")
                .inner_size(800.0, 500.0)
                .resizable(false)
                .visible(false);

        if let Some(main_win) = app.get_webview_window("main") {
            if let (Ok(pos), Ok(size), Ok(scale_factor)) = (
                main_win.outer_position(),
                main_win.outer_size(),
                main_win.scale_factor(),
            ) {
                let child_w_phys = (800.0 * scale_factor) as i32;
                let child_h_phys = (500.0 * scale_factor) as i32;
                let x_phys = pos.x + (size.width as i32 - child_w_phys) / 2;
                let y_phys = pos.y + (size.height as i32 - child_h_phys) / 2;
                let x_log = x_phys as f64 / scale_factor;
                let y_log = y_phys as f64 / scale_factor;
                builder = builder.position(x_log, y_log);
            }
        }

        builder.build().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn show_magnet_window(window: Window) -> Result<(), String> {
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn close_window(window: Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_free_disk_space() -> Result<u64, String> {
    let disks = Disks::new_with_refreshed_list();

    let main_disk = disks
        .list()
        .iter()
        .find(|d| {
            let mount = d.mount_point().to_string_lossy().to_string();
            mount == "/" || mount == "C:\\"
        })
        .or_else(|| disks.list().first());

    match main_disk {
        Some(disk) => Ok(disk.available_space()),
        None => Err("No matching disk found".to_string()),
    }
}

#[tauri::command]
fn get_download_dir(app: AppHandle) -> Result<String, String> {
    app.path()
        .download_dir()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_window_title(window: Window, title: String) -> Result<(), String> {
    window.set_title(&title).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_magnet_window,
            show_magnet_window,
            open_torrent_window,
            close_window,
            set_window_title,
            get_free_disk_space,
            get_download_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
