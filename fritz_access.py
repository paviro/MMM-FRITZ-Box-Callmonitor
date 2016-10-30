import argparse, os, fritzconnection, urllib2, sys, json

def send_file(file, content):
    print json.dumps({"filename": file, "content": content})
    sys.stdout.flush()

class FritzAccess(object):
    """
    Stores the connection and provide convenience functions
    """

    def __init__(self, address, port, user, password):
        super(FritzAccess, self).__init__()
        self.fc = fritzconnection.FritzConnection(address, port, user, password)

    def download_recent_calls(self, directory = "data"):
        result = self.fc.call_action("X_AVM-DE_OnTel", "GetCallList")
        filename = os.path.join(directory, "calls.xml")
        self.forward_file(result["NewCallListURL"], filename)

    def download_phone_book(self, directory = "data"):
        result = self.fc.call_action("X_AVM-DE_OnTel", "GetPhonebookList")
        if (len(result) == 0):
            raise Exception("Please check if your user has access to \"View and edit FRITZ!Box settings\".")
            sys.exit(1)
        for phonebook_id in result["NewPhonebookList"]:
            result_phonebook = self.fc.call_action("X_AVM-DE_OnTel", "GetPhonebook", NewPhonebookID=phonebook_id)
            filename = os.path.join(directory, "pbook_%s.xml" % phonebook_id)
            self.forward_file(result_phonebook["NewPhonebookURL"], filename)

    def forward_file(self, url, filename):
        try:
            f = urllib2.urlopen(url)
            content = f.read()
            f.close()
            # replace newline with space keep clear where the file ends
            content = content.replace("\n", " ")
            send_file(filename, content)
        except urllib2.HTTPError, e:
            raise Exception("Error (HTTP)" + str(e.code) + url)
            sys.exit(1)
        except urllib2.URLError, e:
            raise Exception("Error (URL)" + str(e.code) + url)
            sys.exit(1)


def main(args):    
    handle = FritzAccess(
        address=args.ip,
        port=args.port,
        user=args.username,
        password=args.password
    )
    
    if args.contacts_only:
        handle.download_phone_book()
        return
    
    if args.calls_only:
        handle.download_recent_calls()
        return
    
    handle.download_phone_book()
    handle.download_recent_calls()
    sys.exit(0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='command line utility for FRITZ!Box access to download phone books and recent calls')
    parser.add_argument('-p', '--password', nargs='?', default='', help='password')
    parser.add_argument('-u', '--username', nargs='?', default='', help='username')
    parser.add_argument('-P', '--port', nargs='?', default=49000, help='tr064 port')
    parser.add_argument('-i', '--ip', nargs='?', default="192.168.178.1", help='ip')
    parser.add_argument('-co', '--contacts-only', action='store_true', help='only return contacts')
    parser.add_argument('-ca', '--calls-only', action='store_true', help='only return calls')
    args = parser.parse_args()

    main(args)
