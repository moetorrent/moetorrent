use std::process::Child;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct TransmissionState(pub Mutex<Option<Child>>);

pub fn start_daemon(app: &AppHandle) -> Result<(), String> {
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let daemon_path = match app.path().resolve(
        "resources/transmission/transmission-daemon.exe",
        tauri::path::BaseDirectory::Resource,
    ) {
        Ok(p) => p,
        Err(_) => resource_dir
            .join("resources")
            .join("transmission")
            .join("transmission-daemon.exe"),
    };

    let app_local_data_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    let config_dir = app_local_data_dir.join("transmission-state");

    if !config_dir.exists() {
        std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }

    let download_dir = app
        .path()
        .download_dir()
        .unwrap_or_else(|_| config_dir.join("downloads"));

    println!("Starting transmission-daemon from {:?}", daemon_path);
    println!("Config dir: {:?}", config_dir);
    println!("Download dir: {:?}", download_dir);

    #[cfg(target_os = "windows")]
    use std::os::windows::process::CommandExt;

    let mut command = std::process::Command::new(&daemon_path);
    command
        .arg("-f")
        .arg("-g")
        .arg(&config_dir)
        .arg("-w")
        .arg(&download_dir);

    #[cfg(target_os = "windows")]
    command.creation_flags(0x08000000); // CREATE_NO_WINDOW

    let child = command
        .spawn()
        .map_err(|e| format!("Failed to spawn daemon at {:?}: {}", daemon_path, e))?;
    app.manage(TransmissionState(Mutex::new(Some(child))));
    Ok(())
}

pub fn stop_daemon(app: &AppHandle) {
    if let Some(state) = app.try_state::<TransmissionState>() {
        if let Ok(mut lock) = state.0.lock() {
            if let Some(mut child) = lock.take() {
                println!("Killing transmission-daemon...");
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}
