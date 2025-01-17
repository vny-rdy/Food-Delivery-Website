import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";
import { IoIosQrScanner } from "react-icons/io";
import axios from "axios";

const SearchBar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://food-delivery-website-sepia-tau.vercel.app/api/menus/menu?search=${searchQuery}`);
      const results = response.data;
      console.log('Search Results:', results);
      onSearchResults(results); // Pass results to the parent component or state
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleVoiceSearch = async () => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        console.log('Voice Input:', transcript);
        handleSearch(); // Trigger search with voice input
      };

      recognition.onerror = (event) => {
        console.error('Voice Search Error:', event.error);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition not supported in this browser.', error);
    }
  };

  const handleScan = () => {
    alert('Scanner functionality is not implemented yet.');
    // Add QR/Barcode scanning functionality here
  };

  return (
    <div style={styles.container} className="bg-slate-100 w-[400px] max-xl:w-auto">
      <div className="bg-slate-300 p-2 rounded-xl cursor-pointer">
        <CiSearch onClick={handleSearch} style={styles.icon} className="bg-slate-600" />
      </div>
      <input
        type="text"
        placeholder="Search Food Delivery.in"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.input}
        className="bg-slate-100"
      />
      <FaMicrophone onClick={handleVoiceSearch} style={styles.icon} />
      <IoIosQrScanner onClick={handleScan} style={styles.icon} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    padding: '5px',
    margin: 'auto',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '5px',
  },
  icon: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    margin: '0 5px',
  },
};

export default SearchBar;
