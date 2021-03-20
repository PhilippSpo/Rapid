module.exports = {
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "http://localhost:4000/socket.io/:path*",
      },
    ];
  },
};
