'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

// This page will redirect to the home page if someone tries to access /NFT-details directly
// without a specific tokenId
const NFTDetailsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page
    router.push('/');
  }, [router]);

  // Show loader while redirecting
  return <Loader />;
};

export default NFTDetailsRedirect;
