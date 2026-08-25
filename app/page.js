if (!r.ok) {
  console.error("AI Router Error:", j);

  throw new Error(
    j.details
      ? `${j.message}\n\n${j.details.join("\n")}`
      : j.message
  );
}
