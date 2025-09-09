import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Clock,
  Cloud,
  Globe,
  MapPin,
  Shield,
  Smartphone,
  Star,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const features = [
    {
      icon: Waves,
      title: "Real-time Tide Predictions",
      description:
        "Get accurate high and low tide times for your nearest coast",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description:
        "Automatically finds the nearest coastal tide station to your location",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Clock,
      title: "Countdown Timer",
      description:
        "Live countdown to the next tide event with visual indicators",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified before high or low tides with customizable timing",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Star,
      title: "Favorite Locations",
      description:
        "Save and quickly switch between your favorite coastal spots",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      description:
        "View current weather conditions including wind, waves, and temperature",
      color: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  const benefits = [
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Access tide information on any device, anywhere",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Tide data for coastal locations worldwide",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your location data is stored locally and never shared",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-20 sm:px-6 lg:px-8 dark:from-blue-950/20 dark:to-background">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Waves className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Tide Information
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
              Get real-time tide predictions, weather conditions, and smart
              alerts for your nearest coast. Never miss a tide again.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/dashboard">
                <Button className="gap-2" size="lg">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave SVG */}
        <div className="absolute right-0 bottom-0 left-0">
          <svg
            className="w-full text-blue-100 dark:text-blue-950/20"
            fill="currentColor"
            viewBox="0 0 1440 120"
          >
            <title>Decorative wave separator</title>
            <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              Everything You Need for Tide Tracking
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Comprehensive tide information and tools designed for surfers,
              fishermen, beachgoers, and coastal enthusiasts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  className="transition-all hover:shadow-lg"
                  key={feature.title}
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex rounded-lg bg-background p-3 ${feature.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get started in seconds with our simple three-step process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl">
                  1
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">
                Allow Location Access
              </h3>
              <p className="text-muted-foreground">
                Grant permission to detect your current location automatically
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl">
                  2
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">Find Nearest Coast</h3>
              <p className="text-muted-foreground">
                We'll automatically locate the nearest tide station to you
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl">
                  3
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-lg">View Tide Times</h3>
              <p className="text-muted-foreground">
                See real-time tide predictions and set up alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div className="flex gap-4" key={benefit.title}>
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/20">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-3xl sm:text-4xl">
            Ready to Track Tides?
          </h2>
          <p className="mb-8 text-blue-100 text-xl">
            Join thousands of users who never miss a perfect tide
          </p>
          <Link to="/dashboard">
            <Button className="gap-2" size="lg" variant="secondary">
              Start Tracking Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
