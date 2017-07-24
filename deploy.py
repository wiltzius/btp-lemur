# noinspection PyUnresolvedReferences
from getpass import getpass

from plumbum import SshMachine
# from plumbum.cmd import git


def main():
  with SshMachine('cowville.net', user='tom', port=23) as remote:
    with remote.cwd('/home/books2pr/lemur'):
      print(remote['git']['pull']())
      print(remote['sudo']['./production_restart_il.sh']())


if __name__ == '__main__':
  main()
