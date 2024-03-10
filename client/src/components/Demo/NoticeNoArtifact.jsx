function NoticeNoArtifact() {
  return (
    <p>
      ⚠️ Cannot find <span className="code">Election</span> contract artifact.
      Please check the truffle deployment first, then restart the react dev server.
    </p>
  );
}

export default NoticeNoArtifact;
