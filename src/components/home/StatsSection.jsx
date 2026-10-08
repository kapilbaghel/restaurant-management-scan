export default function StatsSection() {
  const stats = [
    {
      value: "500+",
      label: "Restaurants Managed",
    },
    {
      value: "10K+",
      label: "Orders Processed",
    },
    {
      value: "50K+",
      label: "Tables Connected",
    },
    {
      value: "99.9%",
      label: "System Uptime",
    },
  ];

  return (
    <section className="border-y border-[#E5DED4] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-6 py-10 text-center md:py-12 ${
              index !== 0
                ? "border-l border-[#E5DED4]"
                : ""
            }`}
          >
            <div className="text-3xl font-bold tracking-tight text-[#171411] md:text-4xl">
              {stat.value}
            </div>

            <div className="mt-2 text-sm text-[#716B64]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}