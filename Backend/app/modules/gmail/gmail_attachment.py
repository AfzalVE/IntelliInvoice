class GmailAttachment:

    @staticmethod
    def extract(payload: dict) -> list[dict]:

        attachments = []

        def walk(part: dict):

            filename = part.get("filename", "")
            body = part.get("body", {})

            if filename and body.get("attachmentId"):

                attachments.append(
                    {
                        "filename": filename,
                        "mimeType": part.get("mimeType"),
                        "attachmentId": body.get("attachmentId"),
                        "size": body.get("size", 0),
                    }
                )

            for child in part.get("parts", []):
                walk(child)

        walk(payload)

        return attachments