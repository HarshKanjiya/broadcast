import { Skeleton } from "@/components/ui/Skeleton";
import { FC } from "react";

const PostFeedSkeleton: FC = ({}) => {
  return (
    <div className="rounded-md overflow-hidden bg-white shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">
      <div className="px-3 sm:px-6 py-2 sm:py-4 flex-col sm:flex-row flex w-full justify-between">
        <div className=" sm:w-[5.5rem]" >
          <Skeleton className="sm:ml-4 w-20 h-6 sm:h-20 sm:w-8 mb-4 sm:mb-0 " />
        </div>

        <div className="w-full flex flex-col gap-3 ">
          <div className="max-h-40 flex gap-3 sm:mt-1  ">
            <Skeleton className="h-4 flex-1 w-full" />
            <Skeleton className="h-4 flex-1 w-full" />
            <Skeleton className="h-4 flex-1 w-full" />
          </div>

          <Skeleton className="h-6  w-full max-w-[50%]" />

          <Skeleton className="h-24  w-full" />
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm p-3 sm:px-6 w-full">
        <Skeleton className="h-5 w-24 " />
        {/* {commentAmt} comments */}
      </div>
    </div>
  );
};

PostFeedSkeleton.displayName = "PostFeedSkeleton";
export default PostFeedSkeleton;
