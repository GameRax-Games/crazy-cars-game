export interface CarConfig {
  id: string
  name: string
  body: string
  accent: string
  price: number
  maxSpeed: number
  accel: number
  handling: number
}

export const CARS: CarConfig[] = [
  {
    id: "roadster",
    name: "Roadster",
    body: "#ef4444",
    accent: "#1f2937",
    price: 0,
    maxSpeed: 48,
    accel: 34,
    handling: 2.4,
  },
  {
    id: "cruiser",
    name: "Cruiser",
    body: "#3b82f6",
    accent: "#0f172a",
    price: 15,
    maxSpeed: 42,
    accel: 30,
    handling: 2.8,
  },
  {
    id: "hornet",
    name: "Hornet",
    body: "#f59e0b",
    accent: "#111827",
    price: 30,
    maxSpeed: 55,
    accel: 40,
    handling: 2.2,
  },
  {
    id: "viper",
    name: "Viper",
    body: "#10b981",
    accent: "#052e16",
    price: 50,
    maxSpeed: 60,
    accel: 44,
    handling: 2.0,
  },
  {
    id: "phantom",
    name: "Phantom",
    body: "#a855f7",
    accent: "#1e1b4b",
    price: 80,
    maxSpeed: 66,
    accel: 50,
    handling: 2.1,
  },
  {
    id: "bolt",
    name: "Bolt",
    body: "#ec4899",
    accent: "#111827",
    price: 120,
    maxSpeed: 74,
    accel: 58,
    handling: 1.9,
  },
]
