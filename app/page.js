if (!r.ok) {
  console.error("AI Router Error:", j);
  throw Error(
    j.details
      ? j.message + "\n\n" + j.details.join("\n")
      : j.message
  );
}
