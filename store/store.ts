import create from "zustand";
import { CourseSliceType, createCourseSlice } from "./slice/courseSlice";

type StoreState = CourseSliceType;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createCourseSlice(...a),
}));
