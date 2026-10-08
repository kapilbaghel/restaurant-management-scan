import {
  Utensils,
  QrCode,
  ClipboardList,
  Users,
  BarChart3,
  Store,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Store,
      title: "Multi-Restaurant Management",
      description:
        "Manage multiple restaurants and branches from one centralized platform.",
    },
    {
      icon: ClipboardList,
      title: "Smart Order Management",
      description:
        "Track every order from new to preparing, served, payment and completion.",
    },
    {
      icon: QrCode,
      title: "QR Code Ordering",
      description:
        "Let customers scan a table QR code and place their orders directly.",
    },
    {
      icon: Utensils,
      title: "Menu Management",
      description:
        "Create, update and organize your restaurant menu with ease.",
    },
    {
      icon: Users,
      title: "Manager Management",
      description:
        "Assign managers to individual restaurants and control their access.",
    },
    {
      icon: BarChart3,
      title: "Business Insights",
      description:
        "Get a clear view of your restaurant operations and performance.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-[#F7F4EE] px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C99A52]">
            Powerful Features
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#171411] md:text-5xl">
            Everything You Need to
            <span className="block">
              Run Your Restaurant
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-[#716B64] md:text-lg">
            From restaurant management to QR ordering,
            RestaurantOS brings your entire operation
            together in one simple platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#E5DED4] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945] transition duration-300 group-hover:bg-[#D5A960] group-hover:text-[#171411]">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-semibold text-[#171411]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#716B64]">
                  {feature.description}
                </p>

                {/* Bottom Line */}
                <div className="mt-6 h-px w-10 bg-[#D5A960] transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}