import { Platform } from "./platform.type"

export type Game = {
  id?: number,
  image: string | null,
  title: string,
  launchDate: Date | string,
  price: number | string,
  category: string,
  platforms: Platform[]
}

