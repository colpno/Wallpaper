import { Navigate, useParams } from "react-router";

import { useStore } from "@/app/stores/useStore";
import OtherUserProfileLayout from "@/components/layout/OtherUserProfileLayout";
import SavedIdeasLayout from "@/components/layout/SavedIdeasLayout";
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
      <SavedIdeasLayout>
        <MyPins />
      </SavedIdeasLayout>
    );
  }

  return (
    <OtherUserProfileLayout>
      <OtherUserProfileSavedPinsPage />
    </OtherUserProfileLayout>
  );
}

export default ProfilePage;
