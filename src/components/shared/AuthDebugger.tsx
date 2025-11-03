"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface TokenInfo {
  exists: boolean;
  key: string | null;
  value: string | null;
  payload: any | null;
  isExpired: boolean;
  expiresAt: string | null;
}

export default function AuthDebugger() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const checkToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const foundToken = accessToken || token;
    const foundKey = accessToken ? "accessToken" : token ? "token" : null;

    if (!foundToken) {
      setTokenInfo({
        exists: false,
        key: null,
        value: null,
        payload: null,
        isExpired: false,
        expiresAt: null,
      });
      return;
    }

    try {
      // Decode JWT token
      const base64Url = foundToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? payload.exp < now : false;
      const expiresAt = payload.exp
        ? new Date(payload.exp * 1000).toLocaleString()
        : null;

      setTokenInfo({
        exists: true,
        key: foundKey,
        value: foundToken.substring(0, 50) + "...",
        payload,
        isExpired,
        expiresAt,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
      setTokenInfo({
        exists: true,
        key: foundKey,
        value: foundToken.substring(0, 50) + "... (Invalid format)",
        payload: null,
        isExpired: true,
        expiresAt: null,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkToken();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-yellow-100 hover:bg-yellow-200 border-yellow-300"
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        Debug Auth
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-2xl border-2 border-yellow-400">
        <CardHeader className="bg-yellow-50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Auth Debugger
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={checkToken}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Token Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token Exists:</span>
              {tokenInfo?.exists ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  No
                </Badge>
              )}
            </div>

            {tokenInfo?.exists && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage Key:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {tokenInfo.key}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Is Expired:</span>
                  {tokenInfo.isExpired ? (
                    <Badge className="bg-red-100 text-red-800 border-red-300">
                      <XCircle className="h-3 w-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      No
                    </Badge>
                  )}
                </div>

                {tokenInfo.expiresAt && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Expires At:</span>
                    <p className="text-xs text-gray-600 font-mono">
                      {tokenInfo.expiresAt}
                    </p>
                  </div>
                )}

                {tokenInfo.payload && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Token Payload:</span>
                    <pre className="text-xs bg-gray-100 p-2 rounded border overflow-x-auto">
                      {JSON.stringify(tokenInfo.payload, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-sm font-medium">Token Value:</span>
                  <p className="text-xs text-gray-600 font-mono break-all">
                    {tokenInfo.value}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* LocalStorage Info */}
          <div className="border-t pt-4 space-y-2">
            <span className="text-sm font-medium">LocalStorage Keys:</span>
            <div className="space-y-1">
              {["accessToken", "token", "user"].map((key) => {
                const value = localStorage.getItem(key);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-gray-600">{key}:</span>
                    {value ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Set
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Set
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-4 space-y-2">
            <Button
              onClick={() => {
                localStorage.clear();
                checkToken();
              }}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Clear LocalStorage
            </Button>
            <Button
              onClick={() => {
                window.location.href = "/login";
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
