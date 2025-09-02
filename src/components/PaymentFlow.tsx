"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface PaymentFlowProps {
  language?: "english" | "arabic" | "hindi";
  onPaymentSuccess?: (planId: string) => void;
  onPaymentError?: (error: string) => void;
}

const PaymentFlow = ({
  language = "english",
  onPaymentSuccess = () => {},
  onPaymentError = () => {},
}: PaymentFlowProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "razorpay">(
    "stripe",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const isRTL = language === "arabic";

  const getLocalizedText = (key: string) => {
    const texts: Record<
      "english" | "arabic" | "hindi",
      Record<string, string>
    > = {
      english: {
        choosePlan: "Choose Your Plan",
        paymentMethod: "Payment Method",
        cardPayment: "Card Payment",
        upiPayment: "UPI Payment",
        walletPayment: "Wallet Payment",
        processPayment: "Process Payment",
        processing: "Processing...",
        paymentSuccess: "Payment Successful!",
        paymentFailed: "Payment Failed",
        retryPayment: "Retry Payment",
        securePayment: "Secure Payment",
        popular: "Popular",
        free: "Free",
        premium: "Premium",
        features: "Features",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        upiId: "UPI ID",
        selectWallet: "Select Wallet",
      },
      arabic: {
        choosePlan: "اختر خطتك",
        paymentMethod: "طريقة الدفع",
        cardPayment: "دفع بالبطاقة",
        upiPayment: "دفع UPI",
        walletPayment: "دفع بالمحفظة",
        processPayment: "معالجة الدفع",
        processing: "جاري المعالجة...",
        paymentSuccess: "تم الدفع بنجاح!",
        paymentFailed: "فشل الدفع",
        retryPayment: "إعادة المحاولة",
        securePayment: "دفع آمن",
        popular: "شائع",
        free: "مجاني",
        premium: "مميز",
        features: "الميزات",
        cardNumber: "رقم البطاقة",
        expiryDate: "تاريخ الانتهاء",
        cvv: "CVV",
        upiId: "معرف UPI",
        selectWallet: "اختر المحفظة",
      },
      hindi: {
        choosePlan: "अपना प्लान चुनें",
        paymentMethod: "भुगतान विधि",
        cardPayment: "कार्ड भुगतान",
        upiPayment: "UPI भुगतान",
        walletPayment: "वॉलेट भुगतान",
        processPayment: "भुगतान प्रक्रिया",
        processing: "प्रसंस्करण...",
        paymentSuccess: "भुगतान सफल!",
        paymentFailed: "भुगतान असफल",
        retryPayment: "पुनः प्रयास",
        securePayment: "सुरक्षित भुगतान",
        popular: "लोकप्रिय",
        free: "मुफ्त",
        premium: "प्रीमियम",
        features: "सुविधाएं",
        cardNumber: "कार्ड नंबर",
        expiryDate: "समाप्ति तिथि",
        cvv: "CVV",
        upiId: "UPI ID",
        selectWallet: "वॉलेट चुनें",
      },
    };
    return texts[language]?.[key] || texts.english[key];
  };

  const plans: PaymentPlan[] = [
    {
      id: "free",
      name: getLocalizedText("free"),
      price: 0,
      currency: "INR",
      features: [
        "10 AI tutor queries/day",
        "Basic quizzes",
        "Limited flashcards",
        "Basic progress tracking",
      ],
    },
    {
      id: "premium",
      name: getLocalizedText("premium"),
      price: 299,
      currency: "INR",
      features: [
        "Unlimited AI tutor queries",
        "All quiz modules",
        "Unlimited flashcards",
        "Advanced analytics",
        "Offline mode",
        "Priority support",
      ],
      popular: true,
    },
  ];

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setPaymentStatus("idle");

    try {
      let retries = 3;
      let paymentSuccess = false;

      while (retries > 0 && !paymentSuccess) {
        try {
          // Simulate payment gateway call
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Simulate different failure scenarios
          const random = Math.random();

          if (random < 0.05) {
            throw new Error("Network timeout - please check your connection");
          } else if (random < 0.1) {
            throw new Error("Payment gateway temporarily unavailable");
          } else if (random < 0.15 && paymentMethod === "razorpay") {
            throw new Error(
              "UPI callback timeout - payment may still be processing",
            );
          } else if (random < 0.2) {
            throw new Error("Insufficient funds or card declined");
          }

          // Payment successful
          paymentSuccess = true;
          setPaymentStatus("success");
          onPaymentSuccess(selectedPlan);
        } catch (error) {
          retries--;
          console.error(`Payment attempt failed (${3 - retries}/3):`, error);

          if (retries === 0) {
            throw error;
          } else {
            // Wait before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (error) {
      setPaymentStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Payment processing failed";
      onPaymentError(errorMessage);

      // Auto-retry for specific errors
      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("unavailable")
      ) {
        setTimeout(() => {
          if (paymentStatus === "error") {
            setPaymentStatus("idle");
          }
        }, 5000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "stripe":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">
                {getLocalizedText("cardNumber")}
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">{getLocalizedText("expiryDate")}</Label>
                <Input id="expiry" placeholder="MM/YY" maxLength={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">{getLocalizedText("cvv")}</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>
          </div>
        );
      case "razorpay":
        return (
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upi">
                <Smartphone className="h-4 w-4 mr-2" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="card">
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="h-4 w-4 mr-2" />
                Wallet
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upi" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upiId">{getLocalizedText("upiId")}</Label>
                <Input id="upiId" placeholder="user@paytm" />
              </div>
            </TabsContent>
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber2">
                  {getLocalizedText("cardNumber")}
                </Label>
                <Input id="cardNumber2" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry2">
                    {getLocalizedText("expiryDate")}
                  </Label>
                  <Input id="expiry2" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv2">{getLocalizedText("cvv")}</Label>
                  <Input id="cvv2" placeholder="123" type="password" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="wallet" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Wallet className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs">Paytm</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Wallet className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs">PhonePe</span>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto space-y-6 ${isRTL ? "rtl" : "ltr"}`}
    >
      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText("choosePlan")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                } ${plan.popular ? "relative" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-4 bg-primary">
                    {getLocalizedText("popular")}
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold">
                      ₹{plan.price}
                      {plan.price > 0 && (
                        <span className="text-sm font-normal">/month</span>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      {selectedPlan && selectedPlan !== "free" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              {getLocalizedText("securePayment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "stripe" | "razorpay")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stripe">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Stripe
                </TabsTrigger>
                <TabsTrigger value="razorpay">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Razorpay
                </TabsTrigger>
              </TabsList>
              <TabsContent value="stripe">{renderPaymentForm()}</TabsContent>
              <TabsContent value="razorpay">{renderPaymentForm()}</TabsContent>
            </Tabs>

            {/* Payment Status */}
            {paymentStatus === "success" && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  {getLocalizedText("paymentSuccess")}
                </div>
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  {getLocalizedText("paymentFailed")}
                </div>
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === "success"}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {getLocalizedText("processing")}
                </>
              ) : paymentStatus === "error" ? (
                getLocalizedText("retryPayment")
              ) : (
                getLocalizedText("processPayment")
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentFlow;
