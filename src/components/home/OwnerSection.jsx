import {
  Building2,
  Users,
  Utensils,
  ArrowRight,
  Check,
} from "lucide-react";

export default function OwnerSection() {
  return (
    <section
      id="owners"
      className="overflow-hidden bg-[#F7F4EE] px-6 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C99A52]">
              Built For Restaurant Owners
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#171411] md:text-5xl">
              Manage Your Entire
              <span className="block">
                Restaurant Business
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#716B64] md:text-lg">
              Whether you operate one restaurant or multiple
              branches, RestaurantOS gives you one place to
              manage your entire business.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              {[
                "Manage multiple restaurants from one account",
                "Assign managers to individual restaurants",
                "Keep menus, tables and orders organized",
                "Monitor your restaurant operations centrally",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8D8BD] text-[#A87535]">
                    <Check size={14} strokeWidth={2.5} />
                  </div>

                  <span className="text-sm text-[#4F4942]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#171411] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2A2520]">
              Explore Owner Dashboard
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Visual */}
          <div className="relative">

            {/* Main Card */}
            <div className="rounded-3xl border border-[#E5DED4] bg-white p-6 shadow-[0_25px_70px_rgba(23,20,17,0.08)] md:p-8">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#716B64]">
                    Owner Dashboard
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-[#171411]">
                    Your Restaurants
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E8D4] text-[#B88945]">
                  <Building2 size={20} />
                </div>
              </div>

              {/* Restaurant Cards */}
              <div className="mt-7 space-y-4">

                <RestaurantCard
                  icon={Utensils}
                  name="The Olive"
                  location="Gurgaon"
                  manager="Rahul Sharma"
                  status="Active"
                />

                <RestaurantCard
                  icon={Utensils}
                  name="Spice Route"
                  location="Delhi"
                  manager="Amit Verma"
                  status="Active"
                />

                <RestaurantCard
                  icon={Utensils}
                  name="Urban Fork"
                  location="Gurgaon"
                  manager="Neha Kapoor"
                  status="Active"
                />

              </div>

              {/* Bottom Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#E5DED4] pt-6">

                <div className="rounded-xl bg-[#F7F4EE] p-4">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={16}
                      className="text-[#B88945]"
                    />

                    <span className="text-xs text-[#716B64]">
                      Restaurants
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-bold text-[#171411]">
                    03
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F4EE] p-4">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-[#B88945]"
                    />

                    <span className="text-xs text-[#716B64]">
                      Managers
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-bold text-[#171411]">
                    03
                  </p>
                </div>

              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-[#E5DED4] bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F2EB] text-[#3F7D5A]">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-xs text-[#716B64]">
                    Active Managers
                  </p>

                  <p className="text-lg font-bold text-[#171411]">
                    03
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


/* Restaurant Card */

function RestaurantCard({
  icon: Icon,
  name,
  location,
  manager,
  status,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#EAE4DA] p-4 transition hover:border-[#D5A960]">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F4EE] text-[#B88945]">
          <Icon size={19} />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[#171411]">
            {name}
          </h4>

          <p className="mt-1 text-xs text-[#716B64]">
            {location} · Manager: {manager}
          </p>
        </div>

      </div>

      <span className="rounded-full bg-[#E8F2EB] px-3 py-1 text-[11px] font-medium text-[#3F7D5A]">
        {status}
      </span>

    </div>
  );
}