import React, { useEffect, useState, useRef } from "react";
import ReviewItem from "./ReviewItem";
import NotFound from "./NotFound";
import { firestore } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "reviews"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-row justify-center items-center gap-1 py-56 mb-20">
        <h1 className="text-gray-500 font-bold text-3xl">... </h1>
        <h1 className="text-gray-500 font-bold text-3xl">جاري التحميل</h1>
      </div>
    );
  }

  return (
    <>
      {reviews.length > 0 ? (
        <div
          className="w-full"
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reviews.map((review, index) => (
                <ReviewItem index={index} review={review} />
              
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <NotFound type="reviews" />
        </div>
      )}
    </>
  );
}

export default Reviews;
