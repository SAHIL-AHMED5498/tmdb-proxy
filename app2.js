const run = async () => {
  try {
    const res = await fetch('http://localhost:8000/3/movie/550');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

run();
