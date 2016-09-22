import argparse, os, fritzconnection, urllib2, sys

class FritzAccess(object):
    """
    Stores the connection and provide convenience functions
    """

    def __init__(self, address, port, user, password):
        super(FritzAccess, self).__init__()
        self.fc = fritzconnection.FritzConnection(address, port, user, password)

    def download_recent_calls(self, directory):
        result = self.fc.call_action("X_AVM-DE_OnTel", "GetCallList")
        filename = os.path.join(directory, "calls.xml")
        self.download_file(result["NewCallListURL"], filename)

    def download_phone_book(self, directory):
        result = self.fc.call_action("X_AVM-DE_OnTel", "GetPhonebookList")
        for phonebook_id in result["NewPhonebookList"]:
            result_phonebook = self.fc.call_action("X_AVM-DE_OnTel", "GetPhonebook", NewPhonebookID=phonebook_id)
            filename = os.path.join(directory, "pbook_%s.xml" % phonebook_id)
            print filename
            self.download_file(result_phonebook["NewPhonebookURL"], filename)

    def download_file(self, url, filename):
        try:
            f = urllib2.urlopen(url)
            with open(filename, "wb") as local_file:
                local_file.write(f.read())
                os.fsync(local_file)
                return 
        except urllib2.HTTPError, e:
            print "HTTP Error:", e.code, url
            sys.exit(1)
        except urllib2.URLError, e:
            print "URL Error:", e.reason, url
            sys.exit(1)


def main(args):    
    handle = FritzAccess(
        address=args.ip,
        port=args.port,
        user=args.username,
        password=args.password
    )
    handle.download_recent_calls(args.directory)
    handle.download_phone_book(args.directory)
    sys.exit(0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='command line utility for FRITZ!Box access to download phone books and recent calls')
    parser.add_argument('-d', '--directory', nargs='?', default='data', help='output directory')
    parser.add_argument('-p', '--password', nargs='?', default='', help='password')
    parser.add_argument('-u', '--username', nargs='?', default='', help='username')
    parser.add_argument('-P', '--port', nargs='?', default=49000, help='tr064 port')
    parser.add_argument('-i', '--ip', nargs='?', default="192.168.178.1", help='ip')
    args = parser.parse_args()

    main(args)
