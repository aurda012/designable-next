"use client";

import { useRouter } from "next/navigation";

import Button from "./Button";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const LoadMore = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();

  const handleNavigation = (type: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    let nextPageNumber = pageNumber;

    if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
      currentParams.set("page", nextPageNumber.toString());
    } else if (type === "next") {
      nextPageNumber = pageNumber + 1;
      currentParams.set("page", nextPageNumber.toString());
    }

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;

    router.push(newPathname);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="w-full flexCenter gap-5 mt-10">
      <Button
        title="Prev Shots"
        disabled={pageNumber === 1}
        handleClick={() => handleNavigation("prev")}
      />
      <Button
        title="Next Shots"
        disabled={!isNext}
        handleClick={() => handleNavigation("next")}
      />
    </div>
  );
};

export default LoadMore;
