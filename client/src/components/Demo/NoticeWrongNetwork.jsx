function NoticeWrongNetwork() {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      ⚠️ MetaMask is not connected to the same network as the one you deployed to.
    </p>
  );
}

export default NoticeWrongNetwork;
