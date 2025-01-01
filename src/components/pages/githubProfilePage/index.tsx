import { useEffect, useState } from "react";

const GithubProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);

  const fetchGithubProfile = async () => {
    const response = await fetch(
      `https://api.github.com/repos/${"kumawat30rahul"}/${"kumawat30rahul"}/contents/README.md`
    );
    const data = await response.json();
    console.log(data);

    if (data?.content) {
      // Decode base64 content
      const decodedContent = atob(data.content).replace(
        /👋|🌟|💡|🔍|🤝|📚|💬/g,
        (emoji) => `<span>${emoji}</span>`
      );
      setProfileData(decodedContent);
    }
  };

  useEffect(() => {
    fetchGithubProfile();
  }, []);

  return (
    <div className="mt-[100px]">
      <div dangerouslySetInnerHTML={{ __html: profileData }} />
    </div>
  );
};

export default GithubProfilePage;
