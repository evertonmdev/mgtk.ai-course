import { PrismaClient } from "@prisma/client";
import chalk from "chalk";


const prismaSigleton = () => new PrismaClient({
    log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
    ],
})

declare global {
    // biome-ignore lint/style/noVar: <explanation>
    var prisma: undefined | ReturnType<typeof prismaSigleton>;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
const prisma = globalThis.prisma ?? prismaSigleton();

export default prisma


prisma.$on("query", (e) => {
    // console.log("\n\n")
    // console.log(`${chalk.green("Query")}: ${e.query}`)
    // console.log(`${chalk.green("Params")}: ${e.params}`)
    console.log(`${chalk.green("New Query")}`)
    console.log(`${chalk.green("Duration")}: ${e.duration}ms`)
    console.log(`${chalk.green("Target")}: ${e.target}`)
    // console.log("\n\n")
})

prisma.$on("info", (e) => {
    console.log(`${chalk.blue("Info")}: ${e.message}`)
})

prisma.$on("warn", (e) => {
    console.log(`${chalk.yellow("Warn")}: ${e.message}`)
})

prisma.$on("error", (e) => {
    console.log(`${chalk.red("Error")}: ${e.message}`)
})
