import Link from "next/link"
import { MoveLeftIcon } from "lucide-react"

export default function NotFound() {
  return (
    <section className="pt-40 pb-24">
      <div className="min-h-full px-4 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-muted-foreground sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-muted-foreground">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <MoveLeftIcon className="w-5 h-5" />
                  <span>Go back home</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}


