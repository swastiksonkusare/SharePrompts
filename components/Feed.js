"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [timer, setTimer] = useState(null);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    if (searchText.trim() === "") {
      fetchPosts();
      return;
    }

    const newTimer = setTimeout(() => {
      const regex = new RegExp(searchText, "i");

      const filteredPosts = posts.filter(
        (p) =>
          regex.test(p.creator.username) ||
          regex.test(p.tag) ||
          regex.test(p.prompt)
      );

      setPosts(filteredPosts);
    }, 3000);

    setTimer(newTimer);

    // Cleanup the timer when the component unmounts
    return () => {
      clearTimeout(newTimer);
    };
  }, [searchText]);

  const handleTagClick = (query) => {
    setSearchText(query);
  };

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
