interface ProfilePageProps {
	userId: string;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
	return <div>{userId}</div>;
};

export default ProfilePage;
