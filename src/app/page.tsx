"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  redirectToAuthCodeFlow,
  getAccessToken,
} from "./auth/authCodeWithPkce";

export default function Home() {
  const clientId = "9fbbe9fa58234c5d987ba4ba32899494";
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [gotProfile, setGotProfile] = useState<boolean>(false);
  var params;
  var code: string | null;

  if (typeof window !== "undefined") {
    params = new URLSearchParams(window.location.search);
    code = params.get("code");
  }

  useEffect(() => {
    if (!gotProfile) authAndFetch();
    console.log("ASDKJASDJKASBDSKAJBD");
  });

  async function authAndFetch() {
    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      const accessToken = await getAccessToken(clientId, code);
      const response = await fetchProfile(accessToken);

      setProfile(response);
      setGotProfile(true);
    }
  }

  async function fetchProfile(token: any): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  return (
    <>
      {profile != null && (
        <>
          <h1>{`PROFILE -> ${profile.display_name}`}</h1>
          <h1>{profile.followers.total}</h1>
        </>
      )}
    </>
  );
}
