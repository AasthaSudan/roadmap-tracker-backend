function topicCreatedTemplate(name, topicTitle) {
    return `
<!DOCTYPE html>
<html>

<body style="font-family:Arial;background:#f4f4f4;padding:40px;">

<div
style="
background:white;
max-width:600px;
margin:auto;
padding:30px;
border-radius:10px;
">

<h1 style="color:#16a34a;">
📚 Topic Created
</h1>

<h2>
Hello ${name},
</h2>

<p>
Your topic
<b>${topicTitle}</b>
has been created successfully.
</p>

<p>
Keep learning and stay consistent 🚀
</p>

</div>

</body>

</html>
`;
}

module.exports = {
    topicCreatedTemplate,
};