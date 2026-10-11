# ⚡ Campus Canteen - Online Canteen Web Application

A full-stack, college-friendly web application with a **Zepto-inspired fast UI**, built with **Spring Boot 3** and **Vanilla HTML/CSS/JS**.

---

## 🛠️ Tech Stack
- **Backend:** Java 17+, Spring Boot 3, Spring Data JPA, H2 Database (in-memory, zero-config)
- **Frontend:** HTML5, CSS3 (Zepto-style dark violet & emerald green palette), Vanilla JavaScript
- **Architecture:** Monolithic with decoupled REST endpoints

---

## 🚀 How to Run the Project

### Option A: From Terminal / PowerShell
Ensure you have Java 17+ and Maven installed, then run:
```bash
mvn spring-boot:run
```

### Option B: From VS Code
1. Open this workspace in **VS Code**.
2. Navigate to `src/main/java/com/canteen/OnlineCanteenApplication.java`.
3. Click the **Run** button above the `main` method (or press `F5`).

---

## 🌐 Accessing the Application

Once Spring Boot has started:
- Open your browser to: **`http://localhost:8080`**
- H2 Database Console: **`http://localhost:8080/h2-console`**
  - **JDBC URL:** `jdbc:h2:mem:canteendb`
  - **User:** `sa`
  - **Password:** *(leave blank)*

---

## 🔑 Pre-Seeded Demo Credentials

| Role | College ID | Password / PIN | Description |
|---|---|---|---|
| **Student 1** | `21CS101` | `1234` | Aarav Sharma |
| **Student 2** | `21CS102` | `1234` | Priya Patel |
| **Canteen Owner** | `OWNER01` | `admin123` | Chef Ramesh (Manager) |

---

## 📱 Features Walkthrough

1. **Zepto-Style Fast College ID Login:**
   - Single login screen with instant role routing (`STUDENT` ➔ `student.html`, `OWNER` ➔ `owner.html`).

2. **Student View (`student.html`):**
   - Category filter pills (Snacks, Beverages, Meals).
   - Food cards with prices, emojis, descriptions, and dynamic `+ ADD` / quantity `[-] 1 [+]` counters.
   - Floating cart drawer with itemized bill and instant total calculation.
   - Live Order Tracking tab that auto-polls order progress:
     `PENDING` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`.

3. **Canteen Owner Dashboard (`owner.html`):**
   - Live queue counter and total orders summary.
   - Real-time auto-refreshing kitchen order feed.
   - Action buttons:
     - 🍳 *Start Preparing* (transitions state to `PREPARING`)
     - 🔔 *Mark Ready for Pickup* (transitions state to `READY`)
     - ✅ *Mark Completed* (transitions state to `COMPLETED`)
