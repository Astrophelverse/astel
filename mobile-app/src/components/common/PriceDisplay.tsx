import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PriceDisplayProps {
  price: number;
  currency: string;
  size?: "small" | "medium" | "large";
  showCurrency?: boolean;
  originalPrice?: number;
  discount?: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency,
  size = "medium",
  showCurrency = true,
  originalPrice,
  discount,
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { price: 14, currency: 10, original: 12 };
      case "large":
        return { price: 24, currency: 16, original: 18 };
      default:
        return { price: 18, currency: 12, original: 14 };
    }
  };

  const formatPrice = (priceValue: number, currencyCode: string) => {
    const currencySymbols: { [key: string]: string } = {
      NGN: "₦",
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "C$",
      AUD: "A$",
    };

    const symbol = currencySymbols[currencyCode] || currencyCode;

    if (currencyCode === "NGN") {
      // Nigerian Naira formatting
      if (priceValue >= 1000000) {
        return `${symbol}${(priceValue / 1000000).toFixed(1)}M`;
      } else if (priceValue >= 1000) {
        return `${symbol}${(priceValue / 1000).toFixed(1)}K`;
      }
      return `${symbol}${priceValue.toLocaleString()}`;
    } else {
      // International currency formatting
      return `${symbol}${priceValue.toLocaleString()}`;
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <View style={styles.container}>
      {/* Current Price */}
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { fontSize: sizeConfig.price }]}>
          {formatPrice(price, currency)}
        </Text>
        {showCurrency && (
          <Text style={[styles.currency, { fontSize: sizeConfig.currency }]}>{currency}</Text>
        )}
      </View>

      {/* Original Price and Discount */}
      {originalPrice && originalPrice > price && (
        <View style={styles.discountContainer}>
          <Text style={[styles.originalPrice, { fontSize: sizeConfig.original }]}>
            {formatPrice(originalPrice, currency)}
          </Text>
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontWeight: "700",
    color: "#000000",
  },
  currency: {
    fontWeight: "500",
    color: "#8E8E93",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  originalPrice: {
    fontWeight: "400",
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
