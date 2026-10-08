import {
  Store,
  UserPlus,
  QrCode,
  ShoppingCart,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Store,
      title: "Create Your Restaurant",
      description:
        "Add your restaurant or branch and set up all the basic information in one place.",
    },
    {
      number: "02",
      icon: UserPlus,
      title: "Add Your Manager",
      description:
        "Assign a manager to your restaurant and give them access to manage daily operations.",
    },
    {
      number: "03",
      icon: QrCode,
      title: "Setup Tables & QR",
      description:
        "Create your tables and generate QR codes so customers can easily access your menu.",
    },
    {
      number: "04",
      icon: ShoppingCart,
      title: "Receive & Manage Orders",
      description:
        "Customers place orders through QR and your team manages every order from one dashboard.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-white px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C99A52]">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#171411] md:text-5xl">
            From Setup to Orders,
            <span className="block">
              Everything Stays Simple
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-[#716B64] md:text-lg">
            Get your restaurant operations up and running
            with a simple four-step workflow.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Connecting Line */}
          <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-[#E5DED4] lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center"
              >
                {/* Icon */}
                <div className="relative z-10 mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#E5DED4] bg-[#F7F4EE] text-[#B88945] shadow-sm">
                  <Icon size={25} strokeWidth={1.7} />
                </div>

                {/* Number */}
                <p className="mt-6 text-xs font-bold tracking-[0.2em] text-[#C99A52]">
                  STEP {step.number}
                </p>

                {/* Title */}
                <h3 className="mt-3 text-lg font-semibold text-[#171411]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#716B64]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}