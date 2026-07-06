class GmailAttachment:

    @staticmethod
    def extract(payload: dict) -> list:

        attachments = []

        def walk(part):

            filename = part.get("filename")

            body = part.get("body", {})

            if filename and body.get("attachmentId"):

                attachments.append(
                    {
                        "filename": filename,
                        "mimeType": part.get("mimeType"),
                        "size": body.get("size", 0),
                        "attachmentId": body.get("attachmentId"),
                    }
                )

            for child in part.get("parts", []):
                walk(child)

        walk(payload)

        return attachments

    @staticmethod
    def _walk_parts(
        part: dict,
        attachments: list[dict],
    ) -> None:

        filename = part.get(
            "filename",
        )

        if filename:

            attachments.append(
                {
                    "name": filename,
                    "type": filename.split(".")[-1].lower(),
                    "size": (
                        f"{part.get('body', {}).get('size', 0) // 1024} KB"
                    ),
                }
            )

        for child in part.get(
            "parts",
            [],
        ):

            GmailAttachment._walk_parts(
                child,
                attachments,
            )