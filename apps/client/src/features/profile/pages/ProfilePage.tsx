import { Navigate, useParams } from "react-router";

import { useStore } from "@/app/stores/useStore";
import IdeasLayout from "@/components/layout/IdeasLayout";
import OtherUserProfileLayout from "@/components/layout/OtherUserProfileLayout";
import { ROUTES } from "@/constants/common";
import MyPins from "@/features/pin/pages/MyPins";

import OtherUserProfileSavedPinsPage from "./OtherUserProfileSavedPinsPage";

function ProfilePage() {
  const user = useStore((state) => state.user);
  const { username } = useParams();

  if (!username) {
    return <Navigate to={ROUTES.HOME()} />;
  }

  if (user && user.username === username) {
    return (
      <IdeasLayout>
        <MyPins />
      </IdeasLayout>
    );
  }

  return (
    <OtherUserProfileLayout>
      <OtherUserProfileSavedPinsPage />
    </OtherUserProfileLayout>
  );
}

export default ProfilePage;
