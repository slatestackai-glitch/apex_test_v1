export type StoryStage =
  | "idle"
  | "vehicle_asked"
  | "coverage_asked"
  | "plan_loading"
  | "recommended"
  | "phone_asked"
  | "confirming"
  | "confirmed";

export type InputMode = "none" | "quick-replies" | "phone";

export interface QuickReply {
  id: string;
  label: string;
}

export interface PlanData {
  name: string;
  price: string;
  priceUnit: string;
  features: string[];
  tag: string;
}

export interface ConfirmData {
  phone: string;
  reference: string;
  eta: string;
}

export interface StoryMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  card?: "plan" | "confirmation";
  planData?: PlanData;
  confirmData?: ConfirmData;
}

export interface StoryState {
  stage: StoryStage;
  messages: StoryMessage[];
  isTyping: boolean;
  loadingText: string;
  inputMode: InputMode;
  quickReplies: QuickReply[];
  vehicleType: string;
  coverageType: string;
  phone: string;
}

export function resolvePlan(vehicleType: string, coverageType: string): PlanData {
  const isBike = vehicleType.toLowerCase() === "bike";
  const isComprehensive = coverageType.toLowerCase().includes("comprehensive");

  if (isBike) {
    return isComprehensive
      ? {
          name: "RiderShield Pro",
          price: "₹2,800",
          priceUnit: "/ year",
          features: [
            "Zero depreciation cover",
            "Roadside assistance 24/7",
            "Personal accident cover ₹15L",
            "Helmet & accessories cover",
          ],
          tag: "Popular choice",
        }
      : {
          name: "RiderEssential",
          price: "₹1,100",
          priceUnit: "/ year",
          features: [
            "Third-party liability",
            "Personal accident cover ₹5L",
            "Fire & theft protection",
          ],
          tag: "Quick start",
        };
  }

  return isComprehensive
    ? {
        name: "AutoSecure Comprehensive Plus",
        price: "₹5,200",
        priceUnit: "/ year",
        features: [
          "Zero depreciation cover",
          "Roadside assistance 24/7",
          "Cashless claims at 4,500+ garages",
          "Personal accident cover ₹15L",
        ],
        tag: "Best value",
      }
    : {
        name: "AutoSecure Lite",
        price: "₹2,400",
        priceUnit: "/ year",
        features: [
          "Third-party liability",
          "Personal accident cover ₹5L",
          "Minimal documentation required",
        ],
        tag: "Fast track",
      };
}
