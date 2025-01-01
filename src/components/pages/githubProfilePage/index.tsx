import { useEffect, useState } from "react";

const GithubProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loader, setLoader] = useState(true);

  const fetchGithubProfile = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${"kumawat30rahul"}/${"kumawat30rahul"}/contents/README.md`,
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_REPO_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      if (Number(data?.status) > 400) {
        setLoader(false);
        return;
      }
      if (data?.content) {
        // Decode base64 content
        const decodedContent = atob(data.content).replace(
          /👋|🌟|💡|🔍|🤝|📚|💬/g,
          (emoji) => `<span>${emoji}</span>`
        );
        setProfileData(decodedContent);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching Github profile:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchGithubProfile();
  }, []);

  return (
    <div className="mt-[100px]">
      {!profileData && !loader && (
        <div className="flex items-center justify-center w-full">
          <h2 className="text-2xl font-bold">No data found</h2>
        </div>
      )}
      {loader ? (
        <div className="mt-[100px] flex items-center justify-center w-full">
          <div className="loader"></div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: profileData }} />
      )}
    </div>
  );
};

export default GithubProfilePage;
